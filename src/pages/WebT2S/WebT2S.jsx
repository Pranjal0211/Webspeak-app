import Nav from '../../components/Nav';
import SpeechBox from '../../components/SpeechBox.jsx';
import './WebT2S.css';

function WebT2S() {
    return (
        <>
            <Nav/>
            <div className="webt2sContainer">
                <SpeechBox variant="webT2S"/>
            </div>
        </>
    )
}

export default WebT2S;