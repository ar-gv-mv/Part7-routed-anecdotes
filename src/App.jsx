import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useNavigate, useParams
} from 'react-router-dom'
import  { useField } from './hooks'

const Menu = () => { 
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const Notification = ({message}) => {
  return(
  <div>{message}</div>
  )
}

const Anecdote = ({anecdotes}) => 
  { 
    const { id } = useParams()
    const anecdote = anecdotes.find(a => a.id === Number(id))
    console.log(anecdote)
    return(
  <div>
    <h1>{anecdote.content} by {anecdote.author}</h1>
    <div>has {anecdote.votes} votes</div>
    <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
  </div>
    )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id} >
        <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
      </li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is &quot;a story with a point&quot;.</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = ({addNew, setNotification}) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()
  const contentForm = useField('text')
  const authorForm = useField('text')
  const urlForm = useField('text')

  const handleReset = (e) => {
    e.preventDefault()
    contentForm.reset()
    authorForm.reset()
    urlForm.reset()
  }



  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: contentForm.value,
      author: authorForm.value,
      info: urlForm.value,
      votes: 0
    })
    setNotification(`a new anecdote ${contentForm.value} created`)
    setTimeout(() => setNotification(``), 5000)
    navigate(`/`)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input value={contentForm.value} type={contentForm.type} onChange={contentForm.onChange} />
        </div>
        <div>
          author
          <input value={authorForm.value} type={authorForm.type} onChange={authorForm.onChange} />
        </div>
        <div>
          url for more info
          <input value={urlForm.value} type={urlForm.type} onChange={urlForm.onChange} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <Router>
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification}/>
      <Routes>
      <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes}/>}/>
      <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>}/>
      <Route path="/about" element={<About />}/>
      <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification}/>}/>
      </Routes>
      <Footer />
    </div>
    </Router>
  )
}

export default App
