import "./video.css";
import solarVideo from "../assets/solar-system.mp4";

function VideoSection() {
    return(
        <div className="VideoSection">
            <div className="video">
                <video src={solarVideo} autoPlay controls loop muted width={700}></video>
            </div>
            <div className="words">
                <span>
                    <h2>How Planetary Data Helps Us Understand Space</h2>
                </span>
                <p>Planetary science goes beyond images. Comparing <strong>mass</strong>, <strong>diameter</strong>,<strong> gravity</strong>, and <strong>density</strong>, we gain insight into how planets form, behave, and interact within the solar system.</p>
            </div>
        </div>
    );
}

export default VideoSection;