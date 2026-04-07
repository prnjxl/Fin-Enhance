import { useEffect } from "react";
import "./pages.css";
import FeatureSection from "../components/FeatureSection";

export default function Landing() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@hot-page/hotfx-split-flap";
    script.type = "module";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="landing-wrapper">
      <section className="landing-hero">
        <div className="landing-content">
          <hotfx-split-flap
            height="1"
            width="18"
            duration="120"
            class="finance-flap"
          > 
          Redefine the world
          </hotfx-split-flap>
          <br></br>
          <hotfx-split-flap
            height="1"
            width="10"
            duration="120"
            class="finance-flap"
          > 
          of Finance
          </hotfx-split-flap>
          
        </div>
      </section>
      
      <FeatureSection />
    </div>
  );
}

// import "./pages.css"; export default function Landing() { return ( <section className="landing-hero"> <div className="landing-content"> <h1> Redefine the world of </h1><i>Finance</i> </div> </section> ); }