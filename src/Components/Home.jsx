import About from "../pages/About";
import Achievement from "../pages/Achievement";
import AiTools from "../pages/ai-tools";
import Banner from "../pages/Banner";
import Certificates from "../pages/Certificates";
import Contact from "../pages/Contact";
import Experience from "../pages/Experience";
import Services from "../pages/Services";

const Home = () => {
    return (
        <main className="portfolio-page">
            <Banner />
            <About />
            <Services />
            <AiTools />
            <Achievement />
            <Experience />
            <Certificates />
            <Contact />
        </main>
    );
};

export default Home;
