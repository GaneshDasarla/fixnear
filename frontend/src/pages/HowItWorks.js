import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HowItWorks() {
  return (
    <>
      <Navbar />

      <div className="how-wrapper">
        <h1>How FixNear Works</h1>
        <p className="how-subtitle">
          Getting help is simple. Here's how it works in 4 easy steps.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <div>
              <span className="step-label">Step 1</span>
              <h3>Search</h3>
              <p>
                Enter your service need and location to find nearby
                professionals.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-icon">👤</div>
            <div>
              <span className="step-label">Step 2</span>
              <h3>Choose a Pro</h3>
              <p>
                Browse profiles, ratings, and reviews to pick the best provider.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-icon">📅</div>
            <div>
              <span className="step-label">Step 3</span>
              <h3>Book Instantly</h3>
              <p>
                Send a booking request with your preferred date and time.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-icon">⭐</div>
            <div>
              <span className="step-label">Step 4</span>
              <h3>Rate & Review</h3>
              <p>
                After the job, rate your experience to help the community.
              </p>
            </div>
          </div>
        </div>

        <button className="btn-primary how-btn">
          Find a Service Provider
        </button>
      </div>

      <Footer />
    </>
  );
}

export default HowItWorks;
