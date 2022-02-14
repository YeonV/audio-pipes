import React, { useState, useEffect, useRef } from 'react'
import { FiMic, FiMicOff} from 'react-icons/fi'
import { IconButton } from './ui/IconButton'

const getMedia = async (clientDevice) => {

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          // eslint-disable-next-line no-unused-expressions
          (clientDevice === null || devices.indexOf(clientDevice === -1)) ? true : { deviceId: { exact: clientDevice } }
        }),
      video: false,
    })
  } catch (err) {
    console.log('Error:', err)
  }
}

const Webaudio = ({style, kind}) => {
  const [webAud, setWebAud] = useState(false)
  const audioData = useRef(null);
  const amplitudeArray = useRef(null);
  // const [wsReady, setWsReady] = useState(false)
  const [webAudName, setWebAudName] = useState("")
  const audioContext = webAud && new (window.AudioContext || window.webkitAudioContext)();
  const [anchorEl, setAnchorEl] = useState(null);

  // const getSchemas = useState()
  
  const [clientDevices, setClientDevices] = useState([])
  const [clientDevice, setClientDevice] = useState(clientDevices[0] || {})
  



  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const s = useRef()
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
      setClientDevices(devices)
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
    webAud && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && getMedia(clientDevice).then(stream => {
      s.current = stream
      if (!audioContext || audioContext.state === 'closed') {
        return
      }

      const source = audioContext.createMediaStreamSource(stream)
      const scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
      const analyser = audioContext.createAnalyser()
      // // const scriptNode = audioContext.createScriptProcessor(0, 1, 1);
      // console.log("THIS", analyser);      
      source.connect(analyser);
      source.connect(scriptNode);
      source.connect(audioContext.destination);
      audioData.current = analyser;

      scriptNode.onaudioprocess = e => {

      };

      amplitudeArray.current = new Uint8Array(1024);
      analyser.getByteTimeDomainData(amplitudeArray.current)
      console.log(amplitudeArray.current)
    
      // console.log(Math.max(...amplitudeArray.current), amplitudeArray.current, audioData?.current)
    });
  }, [audioContext])

  

  return (
    <>
      <select>
        {clientDevices.filter(c=>c.kind === kind).map((d,i)=><option key={i}>{d.label}</option>)}
      </select>


      {(kind === 'audioinput') && <div aria-describedby={id} size="large" color={webAud ? "inherit" : "secondary"} onClick={(e) => {
        if (webAud) {
          if (audioContext) {
            s.current.getTracks().forEach(track => track.stop())
            audioContext.close()
          }    
          setWebAud(false)
          window.location.reload(true);
        } else {
          setWebAud(true)
        }

      }} data-webaud={webAud} style={style}>
        <IconButton
          icon={!webAud ? FiMic : FiMicOff}
      />
          
        
      </div>}
       
    </>
  )
}

export default Webaudio
