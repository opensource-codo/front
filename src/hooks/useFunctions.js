import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, FREQUENT_ENDPOINT, RECENT_ENDPOINT } from '../api/endpoints';

export default function useFunctions() {
  const [frequentFunctions, setFrequentFunctions] = useState([]);
  const [recentFunctions, setRecentFunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFrequentFunctions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}${FREQUENT_ENDPOINT}`);
      setFrequentFunctions(res.data);
    } catch (error) {
      console.error('자주 쓰는 기능을 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentFunctions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}${RECENT_ENDPOINT}`);
      setRecentFunctions(res.data);
    } catch (error) {
      console.error('최근 쓴 기능을 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = () => {
    fetchFrequentFunctions();
    fetchRecentFunctions();
  };

  return { frequentFunctions, recentFunctions, loading, fetchAll };
}
