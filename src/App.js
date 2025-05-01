import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [data, setData] = useState({});
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch('/images-index.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to fetch index:', err));
  }, []);

  const toggleModel = (model) => {
    setExpanded(prev => ({ ...prev, [model]: !prev[model] }));
  };

  const filteredData = Object.keys(data).filter(model =>
    model.includes(query) ||
    Object.keys(data[model]).some(color => color.includes(query))
  );

  return (
    <div className="App">
      <h1>📸 FashionDux Image Explorer</h1>

      <input
        type="text"
        placeholder="Search model or color..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: '8px', marginBottom: '20px', width: '300px' }}
      />

      {filteredData.length === 0 && <p>No matching models found.</p>}

      <ul>
        {filteredData.map(model => (
          <li key={model}>
            <strong onClick={() => toggleModel(model)} style={{ cursor: 'pointer' }}>
              ▶️ {model}
            </strong>
            {expanded[model] && (
              <ul>
                {Object.entries(data[model]).map(([color, images]) => (
                  <li key={color}>
                    <strong>{color}</strong>
                    <ul>
                      {images.map(image => (
                        <li key={image}>
                          <a
                            href={`/images/${model}/${color}/${image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {image}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
