import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <>
            <h2>Welcome to My Personal Portfolio!</h2>
            <p>
                Hello! My name is <b>Fengyuan Yang</b>, a software student at
                <b>Centennial College</b> who loves turning ideas into reality
                through code.
            </p>
            <p>
                Whether it's building websites, designing databases,
                or experimenting with new tools, I'm always excited to learn and
                grow. Thanks for stopping by my <b>portfolio</b>! At the same time,
                I would love to share my experience with you.
            </p>
            <p id="mission">
                My mission is to continuously grow as a software developer by learning
                from every project, contributing to collaborative environments, and
                building applications that make a difference.
            </p>
            <h2>Feel free to start your journey below:</h2>
            <div className="btn-group">
                <Link to="/project">
                    <button className="nav-btn">View My Projects</button>
                </Link>
                <Link to="/services">
                    <button className="nav-btn">Explore My Services</button>
                </Link>
            </div>
            <p style={{ marginTop: '2rem', color: 'green' }}>
                ✅ This is a test paragraph for CI/CD demo on Render.
            </p>
        </>
    );
}