# generate_spec.ps1
# Comment: Yeh script Spec-Kit ko Sahi Subcommand (specify) aur Prompt ke saath chalaayega.

$command = "specify"
# Hum subcommand 'spec' ki jagah 'specify' use kar rahe hain
$subcommand = "specify" 
$prompt = "Create a detailed technical specification for the 'Physical AI & Humanoid Robotics' textbook based on the 4 Modules and Weekly Breakdown provided in the course details. The spec must include the full file paths and file names for all 12 weeks of content using the format: 'docs/##-ModuleName/##-ChapterName/##-LessonName.md'. Emphasize the integration of ROS 2, Gazebo, and NVIDIA Isaac platforms. Ensure the output is only the Markdown content for SPEC.md."

# Command ko chalao
& $command $subcommand --prompt "$prompt"