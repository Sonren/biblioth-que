import React from 'react'

function addBook(props) {
  return (
    <div>
      <form onSubmit={props.rechargement}>
        <div>
          <label>Nom du livre :</label>
          <input
            type="text"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ISBN :</label>
          <input
            type="text"
            value={props.isbn}
            onChange={(e) => props.setIsbn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de publication :</label>
          <input
            type="date"
            value={props.date}
            onChange={(e) => props.setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter le livre</button>
      </form>
      {props.message && <p>{props.message}</p>}
    </div>
  )
}

export default addBook
