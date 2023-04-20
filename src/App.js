import { useState } from 'react'
import { Button, Spinner, Modal } from 'react-bootstrap';
import Hint from './Hint'
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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

    try {
      const response = await axios.post('https://ineedahint-api.onrender.com/get-hints', {
        problemPrompt: prompt,
        userCode: progress,
        otherInfo: ''
      });
      console.log(`got response: ${response.data.hints}`)
      setHints(response.data.hints.map((hint, index) => ({id: index, text: hint})));
    //       setHints([
    //   {id: 1, text: 'ooookkkaaaay'},
    //   {id: 2, text: 'go sox'},
    //   {id: 3, text: 'oh my'},
    //   {id: 4, text: 'whatevs'}
    // ])
    } catch (error) {
      console.error(error);
      setHints([{id: 0, text: 'Error fetching hint'}]);
    } finally {
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
    <button disabled={isLoading} type="submit" className="btn btn-primary">{isLoading ? 'Loading...' : 'Click to Load'}</button>
  </div>
        

      {hints.length > 0 && (
        <div className="hints-container">
          <div className="hint-item">
            <div className="hint-container">
              <p>{hints[currentHintIndex].text}</p>
              {currentHintIndex < hints.length - 1 && (
                <Button variant="primary" onClick={handleNextHint}>
                  Next Hint
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      </form>
      {/* <ul className="mt-4">
        {hints.map(hint => 
          <Hint key={hint.id} hint={hint} />
        )}
      </ul> */}

      <Modal show={isLoading} backdrop="static" keyboard={false}>
        <Modal.Body>
          <Spinner animation="border" role="status" variant="primary" />
          <div className="sr-only mt-2">Loading...</div>
        </Modal.Body>
      </Modal>


    </div>
  )
}

export default App