import supabase from '../configs/supabase.js';

export const findUserByEmailAndPassword = async (email, password) => {
  return await supabase
    .from('Usuarios')
    .select('*')
    .eq('email', email)
    .eq('Contrasenia', password)
    .single();
};

export const findUserByEmail = async (email) => {
  return await supabase
    .from('Usuarios')
    .select('*')
    .eq('email', email)
    .single();
};

export const insertUser = async (email, nombre, password) => {
  return await supabase
    .from('Usuarios')
    .insert([{ email, nombre, Contrasenia: password }])
    .select()
    .single();
};