import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BodyRegion } from '@/lib/types/analyzer';

export function useBodyRegions(parentId?: string | null) {
  const [regions, setRegions] = useState<BodyRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegions() {
      setLoading(true);
      try {
        let query = supabase
          .from('body_regions')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (parentId === null) {
          query = query.is('parent_id', null);
        } else if (parentId) {
          query = query.eq('parent_id', parentId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRegions(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, [parentId]);

  return { regions, loading, error };
}

export function useRegionPath(regionId: string | null) {
  const [path, setPath] = useState<BodyRegion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!regionId) {
      setPath([]);
      return;
    }

    async function fetchPath() {
      setLoading(true);
      const { data } = await supabase.rpc('get_region_path', { region_id: regionId });
      setPath(data || []);
      setLoading(false);
    }

    fetchPath();
  }, [regionId]);

  return { path, loading };
}
