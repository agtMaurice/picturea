import React from 'react';

export const Pictures = (props) => {


  return <div className="card-container">

{props.pictures.map((pic) =>(
    <div class="card" >
    <img class="card-img-top" src={pic.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{pic.sold} Copies Sold</h5>
      <p class="card-text">{pic.description}</p>
      {!(props.userWa == pic.owner) && (
        <button type="button" onClick={()=>props.buyPicture(pic.index)} class="btn btn-primary mt-2">Buy Picture</button>
      )}
      
    </div>
  </div>
  ))};

</div>
};
