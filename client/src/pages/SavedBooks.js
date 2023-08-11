import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME); // Use the useQuery hook to fetch user data
  const [removeBook] = useMutation(REMOVE_BOOK); // Use the useMutation hook for removeBook
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      const updatedUser = data.removeBook.user;
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        {/* ... */}
      </div>
      <Container>
        <h2 className="pt-5">{/* ... */}</h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {/* ... */}
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
