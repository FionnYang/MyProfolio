export default function Contact() {
    return (
        <>
            <h1>My Contact</h1>
            <div className="contact-container">
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <p>📧 Email: fyyang285@gmail.com</p>
                    <p>📞 Phone: +1 (437) 858-8890</p>
                    <p>🌐 Location: Centennial College</p>
                </div>
                <div className="contact-form">
                    <form action="/" method="get">
                        <label htmlFor="fname">First Name</label>
                        <input type="text" id="fname" name="fname" required />

                        <label htmlFor="lname">Last Name</label>
                        <input type="text" id="lname" name="lname" required />

                        <label htmlFor="phone">Contact Number</label>
                        <input type="tel" id="phone" name="phone" />

                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required />

                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" required></textarea>

                        <button type="submit" className="submit-button">Send Message</button>
                    </form>
                </div>
            </div>
        </>
    );
}