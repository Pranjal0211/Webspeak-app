import { Container, Row, Col } from 'react-bootstrap';
import Nav from '../../components/Nav';
import './Home.css';
import { SvgHome1 } from '../../assets/illustration.jsx';
import { Button } from 'react-bootstrap';
import { Logo } from '../../assets/icons.jsx';

function Home() {
    return (
        <>
            <Nav/>
            <section className="banner" id="home">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={6} xl={7}>
                            <span className="tagline"><span className="gradient-tagline">T2S <Logo/></span> App</span>
                            <h1 className="tagline" style={{background: 'linear-gradient(90.21deg, rgba(65, 38, 216, 0.5) -5.91%, rgba(1, 0, 0, 0.5) 111.58%)'}} >Welcome to my Website</h1>
                            <p>Welcome to Webspeak, where your content takes center stage. With our text-to-speech technology, let your website speak volumes and leave a lasting impression.</p>
                            <Button href="/T2S" variant="primary" size="lg">Click Here</Button>
                        </Col>
                        <Col xs={12} md={6} xl={5}>
                            <div style={{ maxWidth: "100%", height: "auto"}} className="SvgHome1"><SvgHome1 /></div>
                        </Col>    
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Home;