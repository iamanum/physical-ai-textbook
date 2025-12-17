import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// Header Section Fix
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)} style={{
      backgroundColor: '#0f172a', 
      padding: '6rem 0',
      textAlign: 'center',
      borderBottom: '1px solid rgba(45, 212, 191, 0.2)'
    }}>
      <div className="container">
        <h1 style={{color: '#ffffff', fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem'}}>
          {siteConfig.title}
        </h1>
        <p style={{color: '#94a3b8', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 2.5rem'}}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--lg"
            style={{
              backgroundColor: '#14b8a6',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '12px',
              fontWeight: 'bold',
              boxShadow: '0 10px 20px rgba(20, 184, 166, 0.3)'
            }}
            to="/docs/introduction">
            Start Reading Now 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

// Module Card Component
function Feature({title, description, icon, to}) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
      <div className="card shadow--md" style={{
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        height: '100%',
        padding: '30px',
        transition: 'transform 0.3s ease',
        background: 'white'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: "drop-shadow(0 0 10px #2dd4bf)" }}>
          {icon}
        </div>
        <h3 style={{fontSize: '1.6rem', color: '#0f172a', fontWeight: '700'}}>{title}</h3>
        <p style={{color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
          {description}
        </p>
        <Link 
          className="button button--outline button--primary" 
          style={{borderRadius: '8px', width: '100%', fontWeight: '600'}} 
          to={to}>
          Explore Module
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout title={siteConfig.title} description="Professional AI Research Portal">
      <HomepageHeader />
      <main style={{backgroundColor: '#f8fafc', padding: '5rem 0'}}>
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>
            Course Curriculum
          </h2>
          <div className="row">
            <Feature 
              title="Getting Started" 
              description="Introduction to the world of Physical AI and project roadmap."
              icon="🚀" 
              to="/docs/introduction"
            />
            <Feature 
              title="Fundamentals" 
              description="Core mathematical and physical principles for robotics."
              icon="🧬" 
              to="/docs/foundations"
            />
            <Feature 
              title="Locomotion Systems" 
              description="In-depth study of movement, balance, and bipedal walking." 
              icon="⚙️" 
              to="/docs/locomotion"
            />
            <Feature 
              title="Manipulation Systems" 
              description="Robot arms, grasping techniques, and precision control." 
              icon="🦾" 
              to="/docs/manipulation"
            />
            <Feature 
              title="Human-Robot Interaction" 
              description="Collaborative AI, social robotics, and safety frameworks." 
              icon="🤝" 
              to="/docs/hri"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}