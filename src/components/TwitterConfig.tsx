import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings } from 'lucide-react';

export const TwitterConfig: React.FC = () => {
  const { twitterConfig, setTwitterConfig } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    apiKey: twitterConfig?.apiKey || '',
    apiSecret: twitterConfig?.apiSecret || '',
    accessToken: twitterConfig?.accessToken || '',
    accessTokenSecret: twitterConfig?.accessTokenSecret || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTwitterConfig(config);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Settings className="w-5 h-5" />
        Twitter API 配置
      </button>

      {isOpen && (
        <div className="mt-4 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Twitter API 设置</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bearer Token</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入 Twitter API Bearer Token"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                保存配置
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};