export default function Project() {
    return (
        <>
            <h1>My Projects</h1>
            <h2>Pixar Gallery</h2>
            <p>This project is a comprehensive web application that catalogs all Pixar movies 
                released to date. It features a dynamic interface that allows users to explore 
                the entire Pixar filmography with ease. The application includes advanced search 
                and sorting functionalities, enabling users to filter movies by title, release 
                year, or director. Users can quickly narrow down their results by selecting a 
                specific year or choosing a director from a dropdown menu.</p>
            <img src="/images/PixarGallery.png" alt="PixarGallery" className="project-image" />
            
            <h2>Pokémon Searcher</h2>
            <p>This project is an interactive web application that allows users to search for 
                Pokémon using the public Pokémon API (PokeAPI). Users can search by either Pokémon 
                number (ID) or name, enabling flexible and efficient lookup functionality. Once 
                a Pokémon is selected, the application displays comprehensive details, including 
                type, abilities, base stats, and sprite images. Additionally, users can add their 
                favorite Pokémon to a personalized favorites list for quick access in future 
                sessions. The application emphasizes responsive design, intuitive user interaction, 
                and seamless API integration. </p>
            <img src="/images/Pokemon.png" alt="Pokemon" className="project-image" />

            <h2>SPA Project</h2>
            <p>This project focuses on the development and design of a Single Page Application (SPA) 
                website that simulates the structure and functionality of a real-world service-based 
                platform. The application includes core sections such as a homepage, a services overview, 
                and an appointment booking feature. While many of the images and textual content are 
                adapted from existing commercial websites for design reference, all layouts, components, 
                and functionality have been independently implemented. </p>
            <img src="/images/SPAproject.png" alt="SPAproject" className="project-image" />
            <img src="/images/SPAproject2.png" alt="SPAproject2" className="project-image" />
        </>
    );
}