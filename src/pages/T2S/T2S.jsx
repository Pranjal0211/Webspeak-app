import Nav from '../../components/Nav';
import './T2S.css';
import SpeechBox from '../../components/SpeechBox.jsx';
function T2S() {
    return (
        <>
            <Nav/>
            <div className="t2sContainer">
                <SpeechBox variant="T2S"/>
            </div>
        </>
    )
}

export default T2S;