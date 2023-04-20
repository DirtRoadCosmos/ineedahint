import { useState } from 'react'
import Hint from './Hint'
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [ hints, setHints ] = useState([])
  const [ prompt, setPrompt ] = useState("")
  const [ progress, setProgress ] = useState("")
  
  const requestHint = (event) => {
    event.preventDefault()
    console.log(`requesting hint with ${prompt} and ${progress}`)
    setHints([
      {id: 1, text: 'ooookkkaaaay'},
      {id: 2, text: 'go sox'},
      {id: 3, text: 'oh my'},
      {id: 4, text: 'whatevs'}
    ])
  }

  const handlePromptChange = (event) => {
    setPrompt(event.target.value)
  }

  const handleProgressChange = (event) => {
    setProgress(event.target.value)
  }

  return (
    
    <div class="container">

      <form onSubmit={requestHint}>
      <div class="form-group mt-4">
    <label for="problem">What are you trying to do?</label>
    <textarea class="form-control" id="problem" placeholder="write a few words, or copy/paste a problem prompt" />
  </div>
  <div class="form-group mt-4">
    <label for="sofar">What have you tried so far?</label>
    <textarea class="form-control" id="sofar" placeholder="copy/paste your current code or text" />
  </div>
  <div class="form-group mt-4">
    <button type="submit" class="btn btn-primary">request hint</button>
  </div>
        
      </form>
      <ul class="mt-4">
        {hints.map(hint => 
          <Hint key={hint.id} hint={hint} />
        )}
      </ul>
    </div>
  )
}

export default App