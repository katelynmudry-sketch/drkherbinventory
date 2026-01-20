-- Create herbs table (master list of herbs per user)
CREATE TABLE public.herbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  common_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table (tracks herbs in each location)
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  herb_id UUID NOT NULL REFERENCES public.herbs(id) ON DELETE CASCADE,
  location TEXT NOT NULL CHECK (location IN ('backstock', 'tincture', 'clinic')),
  quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'out' CHECK (status IN ('full', 'low', 'out')),
  tincture_started_at TIMESTAMP WITH TIME ZONE,
  tincture_ready_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(herb_id, location)
);

-- Enable RLS
ALTER TABLE public.herbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS policies for herbs
CREATE POLICY "Users can view their own herbs" ON public.herbs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own herbs" ON public.herbs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own herbs" ON public.herbs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own herbs" ON public.herbs FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for inventory
CREATE POLICY "Users can view their own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory" ON public.inventory FOR DELETE USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_herbs_updated_at BEFORE UPDATE ON public.herbs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for inventory updates across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.herbs;