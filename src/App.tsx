import { Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Layout from './components/Layout';
import Home from './pages/Home';
import Works from './pages/Works';
import Section from './pages/Section';
import Detail from './pages/Detail';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Theme appearance="light" accentColor="red" grayColor="sand" radius="small" scaling="100%" hasBackground={false}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:section" element={<Section />} />
          <Route path="/works/:section/:work" element={<Detail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Theme>
  );
}
