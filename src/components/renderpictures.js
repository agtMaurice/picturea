import React from 'react';
import { useState } from "react";

export const Pictures = (props) => {

  const [newprice, setNewPrice] = useState('');


  return <div className="card-container">

{props.pictures.map((pic) =>(
    <div class="card">
    <img class="card-img-top" src={pic.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{pic.sold} Copies Sold</h5>
      <p class="card-text">{pic.description}</p>
      <p class="card-title">Price: {pic.price  / 1000000000000000000}cUSD</p>
      { props.walletAddress !== pic.owner &&(
      <button type="button" onClick={()=>props.buyPicture(pic.index)} class="btn btn-primary mt-2">Buy Picture</button>
      )
}

{ props.walletAddress === pic.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={newprice}
           onChange={(e) => setNewPrice(e.target.value)} placeholder="new price"/>
      <button type="button" onClick={()=>props.modifyPrice(pic.index, newprice)} class="btn btn-primary mt-2">Change Price</button>
      
  </div>
</form>
)}


      { props.walletAddress === pic.owner &&(
                    <button
                      type="submit"
                      onClick={() => props.deletePicture(pic.index)}
                      className="btn btn-dark m-3"
                    >
                      Delete Picture
                    </button>
                       )}
    </div>
  </div>
  ))}

</div>
};
