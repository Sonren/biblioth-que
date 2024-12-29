import React from 'react'

function DeleteBook(props) {
  return (
    <div>
      <form onSubmit={props.rechargement}>
        <div>
            <label> Isbn du livre a suppripmer </label>
            <input 
            type="text" 
            value={props.isbnDelete} 
            onChange={(e) => props.setIsbnDelete(e.target.value)}/>
        </div>
        <div>
          <label>Nom du livre :</label>
          <input
            type="text"
            value={props.nameDelete}
            onChange={(e) => props.setNameDelete(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!props.isbnDelete && !props.nameDelete}>supprimer le livre</button>
      </form>
      {props.messageDelete && <p>{props.messageDelete}</p>}
    </div>
  )
}

export default DeleteBook
