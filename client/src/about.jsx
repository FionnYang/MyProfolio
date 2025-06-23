export default function About() {
    return (
        <>
            <h1>ABOUT ME</h1>
            <img src="/images/photo.png" alt="myPhoto" id="photo" />
            <p>
                Hello everyone, I am <span className="name">Yang Fengyuan</span>,
                and I am currently studying for software technician at Centennial
                College in Canada. I'm passionate about full stack development, database
                design, and web application building. Through course learning
                and personal projects, I have gradually mastered technologies
                such as React, Node.js, MongoDB, and Oracle SQL.
            </p>
            <p>
                I like to turn ideas into actual functionality, whether it's
                writing code for classroom tasks or building a website yourself.
                I believe that as a developer, you need not only technical skills,
                but also the ability to adapt to changes and be good at communication
                and teamwork.
            </p>
            <p>
                My goal is to get involved in more projects to improve my programming
                skills and want to try to get involved in game-related projects, which
                is novel and attractive to me.
            </p>
            <p>
                In addition to studying and programming, I like to spend time doing
                relaxing things to relax, such as playing board games, listening to music,
                watching movies, or going out for a walk. Moderate relaxation has kept me
                focused and has inspired me a lot of creative inspiration.
            </p>
            <iframe src="/files/resume.pdf" width="100%" height="600px" title="Resume"></iframe>
        </>
    );
}