#!/usr/bin/env python3
"""
Content Generation Tool
Generates textbook content using AI with human review
"""

import os
import sys
import argparse
from typing import Dict, List, Any
import asyncio
import json
from openai import AsyncOpenAI
from pathlib import Path
import re


class ContentGenerator:
    """
    Tool for generating textbook content using AI with human review process
    """
    
    def __init__(self, api_key: str = None):
        # Get API key from parameter or environment
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY must be provided as parameter or environment variable")
        
        self.client = AsyncOpenAI(api_key=self.api_key)
        self.model = "gpt-4-turbo"  # Using a capable model for textbook content
    
    async def generate_chapter_outline(
        self, 
        topic: str, 
        difficulty_level: str = "intermediate",
        target_audience: str = "undergraduate students"
    ) -> Dict[str, Any]:
        """
        Generate a chapter outline for the given topic
        
        Args:
            topic: Topic for the chapter
            difficulty_level: Difficulty level (introductory, intermediate, advanced)
            target_audience: Target audience for the content
        
        Returns:
            Dictionary containing the chapter outline
        """
        prompt = f"""
        Create a detailed outline for a textbook chapter on "{topic}".
        Difficulty Level: {difficulty_level}
        Target Audience: {target_audience}
        
        Provide the outline in the following JSON format:
        {{
            "title": "Title of the chapter",
            "learning_objectives": ["objective1", "objective2", "..."],
            "sections": [
                {{
                    "title": "Section title",
                    "subsections": ["subsection1", "subsection2", "..."],
                    "key_concepts": ["concept1", "concept2", "..."]
                }}
            ],
            "summary_points": ["point1", "point2", "..."],
            "exercises": ["exercise1", "exercise2", "..."]
        }}
        
        Ensure the outline is comprehensive and appropriate for textbook content.
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert textbook author with deep knowledge of academic writing standards. Create comprehensive outlines that follow educational best practices."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        # Extract JSON from response
        content = response.choices[0].message.content.strip()
        
        # Clean up potential markdown wrappers
        if content.startswith("```json"):
            content = content[7:]  # Remove ```json
        if content.endswith("```"):
            content = content[:-3]  # Remove ```
        
        try:
            outline = json.loads(content)
            return outline
        except json.JSONDecodeError:
            print("Warning: Could not parse AI response as JSON. Raw response:")
            print(content)
            return {"raw_response": content}
    
    async def generate_section_content(
        self, 
        topic: str, 
        section_title: str, 
        outline: Dict[str, Any]
    ) -> str:
        """
        Generate detailed content for a specific section
        
        Args:
            topic: Overall chapter topic
            section_title: Title of the specific section
            outline: Chapter outline for context
        
        Returns:
            Generated content as a markdown string
        """
        prompt = f"""
        Based on the following chapter outline, generate detailed content for the section titled "{section_title}".
        
        Chapter Outline: {json.dumps(outline, indent=2)}
        
        Generate comprehensive content that includes:
        - Clear explanations of concepts
        - Examples where appropriate
        - Technical depth suitable for textbook
        - Smooth transitions between ideas
        - Relevant code examples if applicable
        
        Format the content in Markdown with appropriate headings and formatting.
        Target length: 1000-2500 words for this section.
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert textbook author. Generate comprehensive, accurate, and clearly explained content suitable for an academic textbook. Maintain a formal but accessible tone."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,  # Lower temperature for more consistent factual content
            max_tokens=3000
        )
        
        return response.choices[0].message.content.strip()
    
    async def generate_complete_chapter(
        self,
        topic: str,
        difficulty_level: str = "intermediate",
        target_audience: str = "undergraduate students"
    ) -> Dict[str, Any]:
        """
        Generate a complete chapter including outline and content for all sections
        
        Args:
            topic: Topic for the chapter
            difficulty_level: Difficulty level (introductory, intermediate, advanced)
            target_audience: Target audience for the content
        
        Returns:
            Dictionary containing the complete chapter with outline and content
        """
        print(f"Generating chapter outline for: {topic}")
        outline = await self.generate_chapter_outline(topic, difficulty_level, target_audience)
        
        if "raw_response" in outline:
            print("Failed to generate proper outline, returning raw response")
            return outline
        
        print(f"Outline generated with {len(outline.get('sections', []))} sections")
        
        # Generate content for each section
        chapter_content = {
            "outline": outline,
            "sections": {}
        }
        
        for section in outline.get("sections", []):
            section_title = section.get("title", "")
            print(f"  Generating content for section: {section_title}")
            
            section_content = await self.generate_section_content(topic, section_title, outline)
            chapter_content["sections"][section_title] = section_content
        
        return chapter_content
    
    async def save_chapter_as_markdown(
        self, 
        chapter_data: Dict[str, Any], 
        output_path: str
    ):
        """
        Save the chapter data as a properly formatted markdown file
        
        Args:
            chapter_data: Chapter data returned from generate_complete_chapter
            output_path: Path to save the markdown file
        """
        with open(output_path, 'w', encoding='utf-8') as f:
            # Write title
            title = chapter_data["outline"].get("title", "Untitled Chapter")
            f.write(f"# {title}\n\n")
            
            # Write learning objectives
            objectives = chapter_data["outline"].get("learning_objectives", [])
            if objectives:
                f.write("## Learning Objectives\n\n")
                for obj in objectives:
                    f.write(f"- {obj}\n")
                f.write("\n")
            
            # Write section content
            for section_title, content in chapter_data["sections"].items():
                # Ensure the section starts with a heading
                if not content.startswith("##"):
                    f.write(f"## {section_title}\n\n")
                f.write(f"{content}\n\n")
            
            # Write summary points
            summary_points = chapter_data["outline"].get("summary_points", [])
            if summary_points:
                f.write("## Summary\n\n")
                for point in summary_points:
                    f.write(f"- {point}\n")
                f.write("\n")
            
            # Write exercises
            exercises = chapter_data["outline"].get("exercises", [])
            if exercises:
                f.write("## Exercises\n\n")
                for i, exercise in enumerate(exercises, 1):
                    f.write(f"{i}. {exercise}\n\n")


async def main():
    parser = argparse.ArgumentParser(description="AI Content Generator for Textbook")
    parser.add_argument("topic", help="Topic for the chapter to generate")
    parser.add_argument("--output", "-o", help="Output file path (default: generated_chapter.md)", 
                       default="generated_chapter.md")
    parser.add_argument("--difficulty", "-d", choices=["introductory", "intermediate", "advanced"], 
                       default="intermediate", help="Difficulty level")
    parser.add_argument("--audience", default="undergraduate students", 
                       help="Target audience description")
    parser.add_argument("--api-key", help="OpenAI API key (alternatively use OPENAI_API_KEY environment variable)")
    
    args = parser.parse_args()
    
    try:
        generator = ContentGenerator(api_key=args.api_key)
        
        print(f"Generating chapter on: {args.topic}")
        print(f"Difficulty: {args.difficulty}")
        print(f"Target Audience: {args.audience}")
        print(f"Output Path: {args.output}")
        print("-" * 50)
        
        chapter_data = await generator.generate_complete_chapter(
            topic=args.topic,
            difficulty_level=args.difficulty,
            target_audience=args.audience
        )
        
        await generator.save_chapter_as_markdown(chapter_data, args.output)
        
        print(f"\nChapter saved to: {args.output}")
        print("Please review the generated content for accuracy before use.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())