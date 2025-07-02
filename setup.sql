-- Create the categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id),
    published_date DATE NOT NULL,
    content TEXT NOT NULL,
    feature_image VARCHAR(1024),
    published BOOLEAN NOT NULL DEFAULT FALSE
);

-- Insert categories into the 'categories' table
INSERT INTO categories (id, name) VALUES
  (1, 'Technology'),
  (2, 'Artificial Intelligence'),
  (3, 'Environment'),
  (4, 'Space'),
  (5, 'Health');

-- Insert articles into the 'articles' table
INSERT INTO articles (id, title, author, category_id, published_date, content, published) VALUES
  (1, 'The Future of Artificial Intelligence', 'Jane Doe', 2, '2025-06-20',
   'Artificial Intelligence continues to revolutionize industries, from healthcare to finance. With advancements in deep learning and neural networks, the future promises even more automation and innovation.',
   TRUE),

  (2, 'Climate Change: A Global Concern', 'John Smith', 3, '2025-06-15',
   'Climate change is accelerating due to human activities. Governments and organizations are working on sustainable practices to mitigate the effects, including renewable energy and carbon capture technologies.',
   FALSE),

  (3, 'Exploring the Universe: Space Missions in 2025', 'Alice Johnson', 4, '2025-06-22',
   'With multiple space agencies launching exploratory missions, 2025 is shaping up to be a pivotal year in space exploration. Mars rovers, lunar bases, and space telescopes are all part of the growing frontier.',
   TRUE),

  (4, 'Quantum Computing: The Next Tech Revolution', 'Michael Lin', 1, '2025-07-01',
   'Quantum computing is poised to disrupt traditional computing with its immense processing power. As companies invest in research, breakthroughs in qubit stability and quantum algorithms are accelerating the path to commercial applications.',
   TRUE),

  (5, 'AI in Education: Personalized Learning Takes Off', 'Samantha Chen', 2, '2025-06-30',
   'Artificial intelligence is transforming education by enabling personalized learning experiences. Adaptive learning platforms can now analyze student behavior and adjust content to maximize comprehension and retention.',
   TRUE),

  (6, 'Ocean Cleanup Technologies Making Waves', 'David Nguyen', 3, '2025-06-25',
   'Innovative ocean cleanup systems are tackling the plastic pollution crisis. Using floating barriers and autonomous vessels, organizations aim to collect tons of waste from major gyres and protect marine biodiversity.',
   FALSE),

  (7, 'Europa Mission: Searching for Alien Life', 'Linda Park', 4, '2025-06-28',
   'NASA''s upcoming Europa Clipper mission will explore the icy moon''s subsurface ocean, searching for signs of life. The mission represents a significant leap in astrobiology and planetary exploration.',
   TRUE),

  (8, 'Wearable Tech Enhancing Patient Monitoring', 'Dr. Kevin Lee', 5, '2025-06-27',
   'Wearable devices are becoming crucial in healthcare, enabling real-time monitoring of vital signs. From heart rate sensors to glucose monitors, these tools are empowering both patients and medical professionals.',
   FALSE);

-- List all categories and articles
SELECT * FROM categories;
SELECT * FROM articles;
