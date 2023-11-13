
import { Container } from '@mui/material'
import './App.css'
import MainContent from './components/MainContent'

function App() {

  return (
    
    <div style={{
      width:"100vw",
      display:"flex",
      justifyContent:"center",
    }}>
      <Container maxWidth="lg">
          <MainContent/>
      </Container>
     </div>
    
  )
}

export default App
