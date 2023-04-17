import { Request, Response } from 'express';
import * as db from '../db';

import { sanitizeString, validateFloat } from "./sanitize";//new

export const createBook = async (req: Request, res: Response) => {
    const { title, author, price } = req.body;

	//injection sanitizing
	let sanTitle = sanitizeString(title);
	let sanAuthor = sanitizeString(author);

	//Float checking
	if (!validateFloat(price)){
		res.status(400).json({ 'status': 'failure - price must be numeric and include the cents.' });
		return;
	}

    await db.createBook(sanTitle, sanAuthor, price);
    res.status(201).json({ 'status': 'success' });
}

export const getPrice = async (req: Request, res: Response) => {
    const { title, author } = req.body;

	//injection sanitizing
	let sanTitle = sanitizeString(title);
	let sanAuthor = sanitizeString(author);

	try{
		const bid = await db.getBookId(sanTitle, sanAuthor);
		const price = await db.getBookPrice(bid);
		res.status(200).json({ price });
	}catch (error){
		res.status(400).json({ 'status': 'failure - query did not find anything with that title and author' });
	}
}
