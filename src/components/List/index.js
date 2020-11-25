import React, { useState } from 'react'
import { JsonRpc, RpcError } from 'eosjs'
import Accordion from "../Accordion";

const EOS_API_URL  = new JsonRpc('https://eos.greymass.com') // can be read from configuration file

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

async function delay(fn, ...args) {
  await timeout(1000)
  return fn(...args)
}

/***
 * Returns an object containing various details about the blockchain.
 * @return Promise<GetInfoResult>
 */
export async function getHeadBlockId() {
  try {
    const { head_block_id } = await EOS_API_URL.get_info();
    return head_block_id
  } catch (err) {
    console.error(`\nCaught exception: `, err.message);
    if (err instanceof RpcError)
      console.error(JSON.stringify(err.json, null, 2));
  }
}

/***
 * Returns an object containing various details about a specific block on the blockchain.
 * @return Promise<GetBlockResult>
 */
export async function getBlockInfo(blockId) {
  try {
    const block = await EOS_API_URL.get_block(blockId);
    return block;
  } catch (err) {
    console.error(`\nCaught exception: `, err.message);
    if (err instanceof RpcError)
      console.error(JSON.stringify(err.json, null, 2));
  }
}

/***
 * Retrieves the ABI for a contract based on its account name.
 * @return Promise<GetAbiResult> 
 */
export async function getAbiInfo(accountName) {
  try {
    const abi = await EOS_API_URL.get_abi(accountName);
    return abi
  } catch (err) {
    console.error(`\nCaught exception: `, err.message);
    if (err instanceof RpcError)
      console.log(JSON.stringify(err.json, null, 2));
  }
}

function List() {
  const [blocks, setBlocks] = useState([])
  const [show, setShow] = useState(false)

  async function fetchData() {
    console.log("Please wait. Fetching data from 'https://eos.greymass.com'")
    setBlocks([])
    let length = 10
    let data = []
 
    while (length--) {
      await delay(async () => {
        if(data.length) {
          const block = await getBlockInfo(data[data.length - 1].previous);
          data.push(block);
        } else {
          const headBlockId = await getHeadBlockId();
          const block = await getBlockInfo(headBlockId);
          data.unshift(block); 
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
       Blocks
      {show && <DisplayBlocks blocks={blocks} />}
    </div>
  )
}

 function DisplayBlocks(props) {
    const blocks = props.blocks 
    const accor = blocks.map(e =>

    <Accordion
    title = {'Block: ' + e.id  + '___' + e.timestamp  + '___' +  e.confirmed}
    content = { 
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
    <> <ul> { accor } </ul> </>
  )
}


export default List
  
