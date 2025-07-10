import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
    <ConfigProvider>
      <App />
    </ConfigProvider>
)
