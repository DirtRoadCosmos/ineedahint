import { useState } from 'react'
import Hint from './Hint'

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
    <div>
      <form onSubmit={requestHint}>
        <input placeholder="What are you trying to do?" defaultValue={prompt} onChange={handlePromptChange} />
        <input placeholder="What do you have so far?" defaultValue={progress} onChange={handleProgressChange} />
        <button type="submit">request hint</button>
      </form>
      <ul>
        {hints.map(hint => 
          <Hint key={hint.id} hint={hint} />
        )}
      </ul>
    </div>
  )
}

export default App