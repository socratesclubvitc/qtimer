import { Component } from 'react';
import chime from './chime.wav';
import './App.css';
import socratesIcon from './socrates.png';

function Card(props) {
    return (
        <div className="card">
            {props.children}
        </div>
    )
}

function Button(props) {
    return (
        <div onClick={props.onClick} className="button">
            {props.children}
        </div>
    )
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [
                {
                    teamName: "",
                    qLeft: 20,
                    timeLeft: 45,
                    timerIsRunning: false,
                    intervalId: 0
                }
            ],
            locked: false,
            footerText: ""
        }

        this.handleTeamNameChange = this.handleTeamNameChange.bind(this);

        this.deductQuestion = this.deductQuestion.bind(this);

        this.addQuestion = this.addQuestion.bind(this);

        this.resetTimer = this.resetTimer.bind(this);

        this.controlTimer = this.controlTimer.bind(this);

        this.manipulateTimer = this.manipulateTimer.bind(this);

        this.toggleLock = this.toggleLock.bind(this);

        this.playChime = () => {
            let track = new Audio(chime);
            track.play();
        }
    }

    handleTeamNameChange(index) {
        return ((event) => {
            this.setState((state, props) => {

                let teams = state.teams;
                teams[index].teamName = event.target.value;

                if (teams[teams.length - 1].teamName.length > 0) {
                    teams.push({ teamName: "", qLeft: 20, timeLeft: 45 });
                }

                while (teams.length > 1 && teams[teams.length - 2].teamName.length === 0) {
                    teams.pop();
                }

                return {
                    ...state,
                    teams: teams
                }
            })
        })
    }

    deductQuestion(index) {
        return (() => {
            this.setState(state => {
                let teams = state.teams;
                teams[index].qLeft = Math.max(0, teams[index].qLeft - 1);
                return {
                    ...state,
                    teams: teams
                }
            })
        })
    }

    addQuestion(index) {
        return (() => {
            this.setState(state => {
                let teams = state.teams;
                teams[index].qLeft = Math.min(20, teams[index].qLeft + 1);
                return {
                    ...state,
                    teams: teams
                }
            })
        })
    }

    resetTimer(index) {
        this.setState((state, props) => {
            let teams = state.teams;
            teams[index].timeLeft = 45;
            clearInterval(teams[index].intervalId);
            teams[index].timerIsRunning = false;
            return {
                ...state,
                teams: teams
            }
        })
    }

    controlTimer(index) {
        return setInterval(() => {
            if (this.state.teams[index].timeLeft === 0) {
                this.resetTimer(index);
                this.playChime();
            } else {
                this.setState((state, props) => {
                    let teams = state.teams;
                    teams[index].timeLeft -= 1;

                    return {
                        ...state,
                        teams: teams
                    }
                })
            }
        }, 1000);
    }

    manipulateTimer(index) {
        return (() => {
            this.setState((state, props) => {
                let teams = state.teams;

                if (teams[index].timerIsRunning) {
                    clearInterval(teams[index].intervalId);
                    teams[index].timerIsRunning = false;
                } else {
                    teams[index].intervalId = this.controlTimer(index);
                    teams[index].timerIsRunning = true;
                }
            })
        })
    }

    toggleLock() {
        this.setState((state, props) => {
            return {
                ...state,
                locked: !state.locked
            }
        })
    }

    render() {
        return (
            <main>
                <nav>
                    <a href="https://socratesclubvitc.github.io">
                        <img id="logo" src={socratesIcon} alt="logo" />
                    </a>
                    <h2>Socrates Club VITC</h2>
                </nav>
                <button id="lock" className="button" onClick={this.toggleLock}>Lock</button>
                <section>
                    {
                        !this.state.locked && [...this.state.teams.map(
                            (team, index) => <Card key={index}>
                                <input
                                    type="text"
                                    value={this.state.teams[index].teamName}
                                    onChange={this.handleTeamNameChange(index)}
                                />
                                <span>{team.qLeft} questions</span>
                                <span>{team.timeLeft + "s"}</span>
                            </Card>
                        ), <p key="n" style={{ textAlign: "center" }}>Words and stuff here</p>]
                    }

                    {
                        this.state.locked && [...this.state.teams.map(
                            (team, index) => {
                                if (team.teamName.trim().length > 0)
                                    return (
                                        <Card key={index}>
                                            <span>{team.teamName}</span>
                                            <span className="questions">
                                                {team.qLeft} left
                                                <span className="question-buttons">
                                                    <Button onClick={this.deductQuestion(index)}>-</Button>
                                                    <Button onClick={this.addQuestion(index)}>+</Button>
                                                </span>
                                            </span>
                                            <Button onClick={this.manipulateTimer(index)}>
                                                {team.timeLeft <= 10 && <span style={{ color: "red" }}>{team.timeLeft + "s"}</span>}
                                                {team.timeLeft > 10 && team.timeLeft + "s"}
                                            </Button>
                                            <Button onClick={() => { this.resetTimer(index) }}>Reset</Button>
                                        </Card>
                                    );
                            }
                        ), <p style={{ textAlign: "center" }}>Words and stuff here</p>]
                    }
                </section>
            </main>
        );
    }
}

export default App;
