import React, { useState } from 'react'
import { JsonRpc } from 'eosjs'
//import "./accordion.css";
import "../../index.css";
import Accordion from "../../components/Accordion";


const api = new JsonRpc('https://eos.greymass.com')

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

async function delay(fn, ...args) {
  await timeout(1000)
  return fn(...args)
}

const getBlockId = async () => {
  try {
    const blockInfo = await api.get_info()
    console.log(blockInfo.head_block_id)
    return blockInfo.head_block_id
  } catch (err) {
    throw err.message
  }
}

async function getBlockInfo(blockId) {
  try {
    const blocks = await api.get_block(blockId)
    return blocks
  } catch (err) {
    throw err.message
  }
}

function List(props) {
  const [blocks, setBlocks] = useState([])
  const [show, setShow] = useState(false)

  async function fetchData() {
    console.log("fetching data")
    setBlocks([])
    let length = 10
    let data = []
    

    let blkId;
    while (length--) {
      await delay(async () => {
        //let blkId;
        if (!data.length) {
          blkId = await getBlockId()
          const block = await getBlockInfo(blkId)
          data.unshift(block)
          console.log(data)
        }
        else {
          blkId = data[data.length - 1].previous
          const block = await getBlockInfo(blkId)
          data.push(block)
        }
      })
    }

    setBlocks(data)
    setShow(true)
  }

  return (
    <div>
      <br></br> <br></br>
      <button className="fetch-button" onClick={fetchData}>
       Load Data 
      </button>
      <br></br> <br></br> <br></br>
      {show && <DisplayBlocks blocks={blocks} />}
    </div>
  )
}

 function DisplayBlocks(props) {
  const blocks = props.blocks
  let data = '';

  const displayExtraData = (block) => {
    console.log(block)
    data = JSON.stringify(block)
    console.log(data);
    //alert(data);
  }

    const Accor = blocks.map(e =>
   
    <Accordion
    title={e.id}
    content={
      
      `
      action_mroot: ${e.action_mroot} <br>
      block_num: ${e.block_num} <br>
      confirmed: ${e.confirmed} <br>
      id: ${e.id} <br>
      new producers - ${e.new_producers} <br>
      previous: ${e.previous} <br>
      producer: ${e.producer} <br>
      producer_signature: ${e.producer_signature} <br>
      ref_block_prefix: ${e.ref_block_prefix} <br>
      schedule_version: ${e.schedule_version} <br>
      timestamp: ${e.timestamp} <br>
      transaction_mroot: ${e.transaction_mroot}
      `
    }
    >
    
    </Accordion>)

  return (
    <> 
    <ul>
    { Accor } 
    </ul>        
    </>
  )
}


export default List
