import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

import more from '../../assets/more.svg';
import like from '../../assets/like.svg';
import comment from '../../assets/comment.svg';
import send from '../../assets/send.svg';

export default function Feed() {
  const [feed, setFeed] = useState([]);

  function registerToSocket() {
    const socket = io('http://localhost:3333');

    socket.on('post', newPost => {
      setFeed([newPost, ...feed]);
    });

    socket.on('like', likedPost => {
      setFeed(feed.map(post => (post._id === likedPost._id ? likedPost : post)));
    });
  }

  useEffect(() => {
    async function getPosts() {
      registerToSocket();
      const response = await api.get('posts');

      setFeed(response.data);
    }

    getPosts().then(null);
  });

  function handleLike(id) {
    api.post(`/posts/${id}/like`).then(null);
  }

  return (
    <section id="post-list">
      {feed.map(post => (
        <article key={post._id}>
          <header>
            <div className="user-info">
              <span>{post.author}</span>
              <span className="place">{post.place}</span>
            </div>
            <img src={more} alt="Mais" />
          </header>
          <img src={`http://localhost:3333/files/${post.image}`} alt="Imagem" />

          <footer>
            <div className="actions">
              <button type="button" onClick={() => handleLike(post._id)}>
                <img src={like} alt="Like" />
              </button>
              <button type="button">
                <img src={comment} alt="Comment" />
              </button>
              <button type="button">
                <img src={send} alt="Send" />
              </button>
            </div>

            <strong>{post.likes} curtidas</strong>

            <p>
              {post.description}
              <span>{post.hashtags}</span>
            </p>
          </footer>
        </article>
      ))}
    </section>
  );
}
