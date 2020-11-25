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
    title={e.id + '    ' + e.timestamp + '    ' + e.confirmed}
    content={
      
      `
      <div> 
        <div class="block"> <b>Action Mroot:</b>           ${e.action_mroot}        </div>
        <div class="block"> <b>Block Number:</b>           ${e.block_num}           </div>
        <div class="block"> <b>Confirmed:</b>              ${e.confirmed}           </div>
        <div class="block"> <b>Block Id:</b>               ${e.id}                  </div>
        <div class="block"> <b>Previous:</b>               ${e.previous}            </div>
        <div class="block"> <b>Producer:</b>               ${e.producer}            </div>
        <div class="block"> <b>New Producers:</b>          ${e.new_producers}       </div>
        <div class="block"> <b>Producer Signature:</b>     ${e.producer_signature}  </div>
        <div class="block"> <b>Reference Block Prefix:</b> ${e.ref_block_prefix}    </div>
        <div class="block"> <b>Schedule Version:</b>       ${e.schedule_version}    </div>
        <div class="block"> <b>Timestamp:</b>              ${e.timestamp}           </div>
        <div class="block"> <b>Transaction Mroot:</b>      ${e.transaction_mroot}   </div>
      </div>      

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
