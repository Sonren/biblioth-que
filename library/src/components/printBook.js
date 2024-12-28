import React from 'react';


function printBook(props){ 

  return (
    <div>
        <table>
            <thead>
                <tr>
                <th>Titre</th>
                <th>Date de sortie</th>
                <th>ISBN</th>
                </tr>
            </thead>
            <tbody>
                {props.books.length > 0 ? (
                props.books.map((book) => (
                    <tr key={book.isbn}>
                    <td>{book.name}</td>
                    <td>{new Date(book.date).toLocaleDateString('fr-FR')}</td>
                    <td>{book.isbn}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="4" className="indisponobilité">
                    Aucun livre disponible.
                    </td>
                </tr>
                )}
            </tbody>
        </table>

   </div>
  
  )

}

export default printBook;

