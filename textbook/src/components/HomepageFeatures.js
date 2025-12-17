import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Comprehensive Coverage',
    img: require('@site/static/img/image.webp').default,
    description: (
      <>
        In-depth exploration of Physical AI and Humanoid Robotics concepts,
        from fundamental principles to advanced implementations.
      </>
    ),
  },
  {
    title: 'AI-Powered Learning',
    img: require('@site/static/img/image.webp').default,
    description: (
      <>
        Interactive Q&A system to help clarify concepts and answer questions
        about the textbook content.
      </>
    ),
  },
  {
    title: 'Accessible Anywhere',
    img: require('@site/static/img/image.webp').default,
    description: (
      <>
        Responsive design ensures the textbook is accessible and readable
        on any device, from desktop to mobile.
      </>
    ),
  },
];

function Feature({ img, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} className={styles.featureImg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}