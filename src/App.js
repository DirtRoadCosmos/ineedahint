import { useState } from 'react'
import { Button, Spinner, Modal } from 'react-bootstrap';
import Hint from './Hint'
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
const fake = true;

const App = () => {
  const [ hints, setHints ] = useState([])
  const [ prompt, setPrompt ] = useState("")
  const [ progress, setProgress ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)
  const [ currentHintIndex, setCurrentHintIndex ] = useState(0)
  
  // const requestHint = (event) => {
  //   event.preventDefault()
  //   console.log(`requesting hint with ${prompt} and ${progress}`)
  //   setHints([
  //     {id: 1, text: 'ooookkkaaaay'},
  //     {id: 2, text: 'go sox'},
  //     {id: 3, text: 'oh my'},
  //     {id: 4, text: 'whatevs'}
  //   ])
  // }

  const requestHint = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    let response;
    try {
      if (fake) {
        response = { data: { hints: [
              'ooookkkaaaay',
              'go sox',
              'oh my',
              'whatevs'
            ]}}
          
      } else {
        response = await axios.post('https://ineedahint-api.onrender.com/get-hints', {
          problemPrompt: prompt,
          userCode: progress,
          otherInfo: ''
        });
      }
    } catch (error) {
        console.error(error);
        setHints([{id: 0, text: 'Error fetching hint'}]);
    } finally {
      console.log(response)
      console.log(`got response: ${response.data.hints}`)
      setHints(response.data.hints.map((hint, index) => ({id: index, text: hint})));
      setIsLoading(false);
    }
  }

  const handlePromptChange = (event) => {
    setPrompt(event.target.value)
  }

  const handleProgressChange = (event) => {
    setProgress(event.target.value)
  }

  const handleNextHint = () => {
    setCurrentHintIndex((prevIndex) => prevIndex + 1);
  };

  const startOver = () => {
    setHints([])
    setCurrentHintIndex(0)
  }

  return (
    
    <div className="container">

      <form onSubmit={requestHint}>
      <div className="form-group mt-4">
    <label htmlFor="problem">What are you trying to do?</label>
    <textarea className="form-control" id="problem" placeholder="write a few words, or copy/paste a problem prompt" />
  </div>
  <div className="form-group mt-4">
    <label htmlFor="sofar">What have you tried so far?</label>
    <textarea className="form-control" id="sofar" placeholder="copy/paste your current code or text" />
  </div>
  <div className="form-group mt-4">
    {hints.length < 1 ? (
<button disabled={isLoading} type="submit" className="btn btn-primary">{isLoading ? 'Loading...' : 'Click to Load'}</button>
    ) : (
      currentHintIndex < hints.length - 1 ?
(<Button variant="primary" onClick={handleNextHint}>
                  Next Hint
                </Button>
    ) : (
<Button variant="primary" onClick={startOver}>
                  Start Over
                </Button>
    )
    )
    }
  </div>
        
  {isLoading && <Spinner animation="grow" role="status" variant="primary" />}
      {hints.length > 0 && (
        <div className="hints-container">
          {hints.filter(hintItem => hintItem.id <= currentHintIndex).sort((a, b) => b.id - a.id).map(hint => 
          <Hint key={hint.id} hint={hint} />
        )}

        </div>
      )}

      </form>

          


    </div>
  )
}

export default App