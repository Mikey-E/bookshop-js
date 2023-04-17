import { Request, Response } from 'express';
import * as db from '../db';

import { sanitizeString, validateInt } from "./sanitize";//new
import { log } from './logging';

export const createCustomer = async (req: Request, res: Response) => {
    const { name, shippingAddress } = req.body;

	//injection sanitizing
	let sanName = sanitizeString(name);
	let sanAddr = sanitizeString(shippingAddress);

    await db.createCustomer(sanName, sanAddr);
    res.status(201).json({ 'status': 'success' });
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const { cid, address } = req.body;

	//injection sanitizing
	let sanAddr = sanitizeString(address);

	//Int checking
	if (!validateInt(cid)){
		res.status(400).json({ 'status': 'failure - cid must be numeric' });
		log(cid + " not numeric");
		return;
	}

    await db.updateCustomerAddress(cid, sanAddr);
    res.status(200).json({ 'status': 'success - address updated if the cid exists' });
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const { cid } = req.body;

	//Int checking
	if (!validateInt(cid)){
		res.status(400).json({ 'status': 'failure - cid must be numeric' });
		log(cid + " not numeric");
		return;
	}

	try{
		const balance = await db.customerBalance(cid);
		res.status(200).json({ balance });
	}catch (error){
		res.status(400).json({ 'status': 'failure - a query did not find anything with that cid' });
		log(cid + " did not find any records in database");
	}
}
