import { useEffect, useState } from "react";
import "./SpeechBox.css";
import PropTypes from "prop-types";
import { franc } from "franc-min";
import { Translate, Clear, Search } from "../assets/icons";
import ISO6391 from "iso-639-1";
import { Toast, ProgressBar, Button, Modal } from "react-bootstrap";
import { getContent } from "../webScrapper/content.js";
import translate from "translate";

function SpeechBox({ variant }) {
    const [voices, setVoices] = useState([]);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [textContent, setTextContent] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("en");

    const [showToast, setShowToast] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [translateModal, setTranslateModal] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                setVoices(window.speechSynthesis.getVoices());
            };
        }
        const languages = ISO6391.getAllNames().map((name, index) => {
            return { value: ISO6391.getAllCodes()[index], label: name };
        });
        setLanguages(languages);
    }, []);

    const handleTextChange = (event) => {
        setTextContent(event.target.value);
    };

    const handleVoiceChange = (event) => {
        setSelectedVoiceIndex(event.target.value);
    };

    const handleRateChange = (event) => {
        setRate(event.target.value);
    };

    const handlePitchChange = (event) => {
        setPitch(event.target.value);
    };

    const handleSpeakClick = () => {
        if (!textContent.trim()) {
            setShowToast(true);
            setErrorMsg("Please enter some text");
            return;
        }
        if (speaking) {
            if (paused) {
                window.speechSynthesis.resume();
                setPaused(false);
            } else {
                window.speechSynthesis.pause();
                setPaused(true);
            }
        } else {
            const utterance = new SpeechSynthesisUtterance(textContent);
            utterance.voice = voices[selectedVoiceIndex];
            utterance.rate = rate;
            utterance.pitch = pitch;
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);
            utterance.onstart = () => {
                setProgress(0);
            };
            utterance.onend = () => {
                setSpeaking(false);
                setProgress(100);
            };
            utterance.onboundary = (event) => {
                const progress = Math.floor(
                    (event.charIndex / textContent.length) * 100
                );
                setProgress(progress);
            };
        }
    };

    const handleStopClick = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
        setProgress(0);
    };

    const fetchContent = () => {
        setTextContent("Loading...");
        const urlInput = document.getElementById("input-url");
        getContent(urlInput.value)
            .then((text) => {
                setTextContent(text);
            })
            .catch((error) => {
                setTextContent("Error fetching content: ", error);
            });
    };

    const handleClearInput = () => {
        setTextContent("");
        setProgress(0);
    };

    const handleTranslateModal = () => {
        const lang = franc(textContent);
        if (lang === "und") {
            setErrorMsg("please enter more text to detect the language");
            setShowToast(true);
            return;
        }
        setTranslateModal(true);
        setDetectedLanguage(lang);
        console.log(languages);
    };

    const handleCloseTranslateModal = () => setTranslateModal(false);

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const translateContent = async () => {
        try {
            console.log(selectedLanguage);
            const res = await translate(textContent, selectedLanguage);
            setTextContent(res);
        } catch (err) {
            console.error(err);
        }
        handleCloseTranslateModal();
    };

    return (
        <>
            <div className="content">
                <Toast
                    style={{ width: "100%" }}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={2000}
                    bg="danger"
                    autohide
                    position="top-center"
                >
                    <Toast.Body>{errorMsg}</Toast.Body>
                </Toast>
                {variant === "webT2S" ? (
                    <div className="container-item flex-cont">
                        <input
                            type="text"
                            className="input-url"
                            id="input-url"
                            placeholder="Enter URL Here"
                            style={{ flex: "15" }}
                        />
                        <Button
                            onClick={fetchContent}
                            style={{ flex: "1", marginLeft: "10px" }}
                            variant="primary"
                        >
                            <Search />
                        </Button>
                    </div>
                ) : (
                    ""
                )}
                <div className="container-item">
                    <ProgressBar
                        style={{ background: "#1a202c", borderRadius: "0px" }}
                        now={progress}
                        label={`${progress}%`}
                    />
                    <textarea
                        value={textContent}
                        onChange={handleTextChange}
                        name="Text Area"
                        id="text-input"
                        cols="30"
                        rows="11"
                        placeholder="Enter Some Text Here"
                    ></textarea>
                </div>
                <div className="container-item">
                    <Button variant="primary" onClick={handleTranslateModal}>
                        Translate <Translate />
                    </Button>
                    <Button
                        style={{ marginLeft: "10px" }}
                        variant="outline-danger"
                        onClick={handleClearInput}
                    >
                        Clear <Clear />
                    </Button>
                </div>
                <div className="container-tem">
                    <div className="flex-cont">
                        <div className="container-item">
                            <label htmlFor="rate">Speech Rate</label>
                            <div className="flex-cont">
                                <input
                                    type="range"
                                    id="rate"
                                    className="custom-range slider"
                                    min="0"
                                    max="2"
                                    value={rate}
                                    onChange={handleRateChange}
                                    step="0.1"
                                />
                                <div id="rate-value" className="slider-value">
                                    {rate}
                                </div>
                            </div>
                        </div>
                        <div className="container-item">
                            <label htmlFor="pitch">Speech Pitch</label>
                            <div className="flex-cont">
                                <input
                                    type="range"
                                    id="pitch"
                                    className="custom-range slider"
                                    min="0"
                                    max="2"
                                    value={pitch}
                                    onChange={handlePitchChange}
                                    step="0.1"
                                />
                                <div id="pitch-value" className="slider-value">
                                    {pitch}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-item">
                    <select id="voice-select" onChange={handleVoiceChange}>
                        {voices.map((voice, index) => (
                            <option key={index} value={index}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="container-item flex-cont">
                    <button
                        className={
                            speaking ? (paused ? "resumeBtn" : "pauseBtn") : "startBtn"
                        }
                        onClick={handleSpeakClick}
                    >
                        {speaking ? (paused ? "Resume" : "Pause") : "Play"}
                    </button>
                    <button className="stopBtn" onClick={handleStopClick}>
                        Stop
                    </button>
                </div>
            </div>

            <Modal show={translateModal} onHide={handleCloseTranslateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Translate <Translate />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <tr>
                            <td>Detected Language: </td>
                            <td>
                                <div id="voice-select">{detectedLanguage.toUpperCase()}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Select Language: </td>
                            <td>
                                <select
                                    id="voice-select"
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                >
                                    {languages.map((language, index) => (
                                        <option key={index} value={language.value}>
                                            {language.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTranslateModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={translateContent}>
                        Translate
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

SpeechBox.propTypes = {
    variant: PropTypes.string.isRequired,
};

export default SpeechBox;
