import React from 'react';
import './FeatureSection.css';
import globeImg from '../assets/globe.png';
import pillarImg from '../assets/pillar.png';
import humanImg from '../assets/human.png';

const FeatureSection = () => {
    return (
        <div className="features-container" id="features">
            <div className="features-card">
                <div className="features-header">
                    <div className="title-group">
                        <span className="subtitle">FINANCE OF FUTURE</span>
                        <h2 className="main-title">Experience that grows with your scale.</h2>
                    </div>
                    <p className="header-desc">
                        A financial operating system that works for you and streamlines your cash flow 
                    </p>
                </div>
                
                <div className="features-grid">
                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <img src={globeImg} alt="Free transfers" className="feature-icon-img" />
                        </div>
                        <h3>Free transfers</h3>
                        <p>Create a financial experience and automate repeat purchases by scheduling recurring payments.</p>
                    </div>

                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <img src={pillarImg} alt="Multiple account" className="feature-icon-img" />
                        </div>
                        <h3>Multiple account</h3>
                        <p>Run your operations with cash from account and generate yield on hands directly in your account.</p>
                    </div>

                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <img src={humanImg} alt="Unmatched security" className="feature-icon-img" />
                        </div>
                        <h3>Unmatched security</h3>
                        <p>Securely manage your finances with organization-wide MFA, card locking, and account level controls.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
