import React, { Component } from 'react';
import './App.css';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { Transcription } from './transcription';
import Crunker from 'crunker';

class App extends Component {
    constructor(props) {
        super(props);

        this.audio = new Crunker();

        this.state = {
            inputText: 'Саша кушал кашу',
            // inputText: 'юла коюта кря скамья ёж бязь вязь связь жилы шило счастье пугаются бриться класс подъезд бязь вязь нить',
            result: ''
        };
    }
    render() {
        return (
            <div className="App">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Простой синтезатор речи</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            Лабораторная работа №4 по курсу ЕЯзИИС
                </NavItem>
                    </Nav>
                </Navbar>
                <div className="content-container">
                    <div className="input-text-component-container">
                        <FormGroup row className="form-group-input-text">
                            <Label for="input-text-area">Исходный текст</Label>
                            <Input
                                type="textarea"
                                name="text"
                                id="input-text-area"
                                value={this.state.inputText}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <Button color="primary" onClick={this.getTranscription}>Получить транскрипцию</Button>
                    <div className="transcriptions-component-container">
                        <FormGroup row className="form-group-transcription">
                            <Label for="transcription-area">Транскрипция</Label>
                            <Input
                                type="textarea"
                                name="text"
                                id="transcription-area"
                                readOnly
                                value={this.state.result}
                            />
                        </FormGroup>
                    </div>
                    <Button color="success" onClick={this.voiceText}>Прослушать текст</Button>
                </div>
            </div>
        );
    }

    handleChange = (e) => {
        this.setState({ inputText: e.target.value });
    }

    getTranscription = () => {
        let result = '';

        result = Transcription.getTranscription(this.state.inputText);

        this.setState({ result: result });
    }

    voiceText = () => {
        this.getTranscription();

        let transcriptionArray = Transcription.getTranscriptionArray(this.state.inputText);

        transcriptionArray = transcriptionArray.map((elem) => {
            return `letters/${elem}.mp3`;
        });

        this.audio.fetchAudio(...transcriptionArray)
            .then(buffers => this.audio.concatAudio(buffers))
            .then(buffer => {
                this.audio.play(buffer);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default App;
