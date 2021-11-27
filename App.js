import './App.css';
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Navbar,
  Nav,
  Button,
  Row,
  Col,
  Collapse,
  Stack,
  Image,
  Form,
} from 'react-bootstrap/';

function App() {
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
  const args = JSON.parse(document.getElementById('data').text);
  const [TempArtistlist, setTempArtistlist] = useState([]);
  const NameRef = useRef();
  const [Artistlist, setArtistlist] = useState(args.artistname_list);
  const [open, setOpen] = useState(false);

  function AddArtist() {
    const TempArtistName = NameRef.current.value;
    if (TempArtistName === '') return;
    setTempArtistlist((prevTempArtistlist) => [
      ...prevTempArtistlist,
      { id: uuidv4(), name: TempArtistName },
    ]);
    NameRef.current.value = null;
  }

  function ClickToSave() {
    let TempArtistlists = [];
    TempArtistlist.forEach((temp) => {
      TempArtistlists = [...TempArtistlists, temp.name];
    });
    let Combinelist = [];
    if (Artistlist === undefined || Artistlist.length === 0) {
      Combinelist = [...TempArtistlists];
    } else {
      Combinelist = [...Artistlist, ...TempArtistlists];
    }

    fetch('/artistsave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combineartistlist: Combinelist }),
    })
      .then((response) => response.json())
      .then((data) => {
        setArtistlist(data.finalartistlist);
        setTempArtistlist([]);
      });
  }

  function RemoveArtist(id) {
    const newTempArtistlist = [...TempArtistlist];
    const newtemp = newTempArtistlist.filter((newtempartist) => newtempartist.id !== id);
    setTempArtistlist(newtemp);
  }

  function RemoveArtistMain(name) {
    const newArtistname = Artistlist.filter((newartistname) => newartistname !== name);
    setArtistlist(newArtistname);
  }

  function ShowArtistList() {
    const list = Artistlist.map((showartistname) => (
      <div>
        <li className="text-primary d-block" key={uuidv4()}>
          {showartistname}
        </li>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => RemoveArtistMain(showartistname)}
        >
          delete
        </Button>
      </div>
    ));
    return (
      <>
        {list}
        <ShowList />
      </>
    );
  }

  function ShowList() {
    const list = TempArtistlist.map((showartistname) => (
      <div>
        <li className="text-danger d-block" key={showartistname.id}>
          {showartistname.name}
        </li>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => RemoveArtist(showartistname.id)}
        >
          delete
        </Button>
      </div>
    ));
    return <>{list}</>;
  }

  return (
    <Container className="text-center bg-info" fluid>
      <Navbar bg="transparent" expand="lg">
        <Container>
          <Nav className="ms-auto">
            <Nav.Link href="profile" className="text-danger text-decoration-underline">
              Profile
            </Nav.Link>
            <Nav.Link href="logout" className="text-danger text-decoration-underline">
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div>
        <h1 className="fw-bold">
          {args.username}
          &apos;s Favorite Artist&apos;s Top Tracks
        </h1>
      </div>
      {args.nonecheck ? (
        <Container>
          <div className="text-center">
            <p1>Please save your favorite artist&apos;s ID below!</p1>
            <Form className="mx-auto">
              <Form.Control
                className="w-25 mx-auto"
                size="sm"
                type="text"
                ref={NameRef}
                placeholder="Enter name"
              />
              <Button variant="secondary" type="button" onClick={AddArtist} size="sm">
                Add
              </Button>
              <Button variant="secondary" type="button" onClick={ClickToSave} size="sm">
                Save
              </Button>
            </Form>
          </div>
          <div>
            <ol>
              <ShowList />
            </ol>
          </div>
        </Container>
      ) : (
        <>
          <Row>
            <Col xs={4}>
              <div className="mx-auto">
                <p2>Your saved artists</p2>
                <ol className="mt-2 mx-auto">
                  <ShowArtistList />
                </ol>
              </div>
            </Col>
            <Col xs={7}>
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="artist_info"
                aria-expanded={open}
                variant="light"
                size="sm"
              >
                <p className="fs-3">{args.artist_name}</p>
              </Button>
              <Collapse in={open}>
                <Stack gap={3}>
                  <p className="mt-2 text-warning">{args.tracktitle}</p>
                  <div>
                    <a href={args.lyrics_url} target="_blank" rel="noreferrer">
                      Lyrics
                    </a>
                  </div>
                  <div>
                    <Image alt="trackpic" src={args.trackpic} roundedCircle />
                  </div>
                  <div>
                    <audio controls src={args.songpreview}>
                      Your browser does not support the
                      <code>audio</code> element.
                      <track kind="captions" label="english_captions" />
                    </audio>
                  </div>
                </Stack>
              </Collapse>
            </Col>
          </Row>
          <div className="text-start">
            <p1>Please save your favorite artist&apos;s ID below!</p1>
            <Row>
              <Col xs={3}>
                <Form className="me-auto">
                  <div className="d-inline-flex">
                    <Form.Control
                      className="w-50"
                      size="sm"
                      type="text"
                      ref={NameRef}
                      placeholder="Enter name"
                    />
                    <Button variant="secondary" type="button" onClick={AddArtist} size="sm">
                      Add
                    </Button>
                    <Button variant="secondary" type="button" onClick={ClickToSave} size="sm">
                      Save
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}

export default App;
