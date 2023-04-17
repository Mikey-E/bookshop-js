import { Request, Response } from "express";
import * as db from "../db";

import { sanitizeString, validateInt } from "./sanitize";//new
import { log } from './logging';

export const createOrder = async (req: Request, res: Response) => {
    const { title, author, name, shippingAddress } = req.body;

	//injection sanitizing
	let sanTitle = sanitizeString(title);
	let sanAuthor = sanitizeString(author);
	let sanName = sanitizeString(name);
	let sanAddr = sanitizeString(shippingAddress);

	try{
		const bid = await db.getBookId(sanTitle, sanAuthor);
		const cid = await db.getCustomerId(sanName, sanAddr);
		await db.createPurchaseOrder(bid, cid);
		res.status(201).json({ 'status': 'success' });
	}catch (error){
		res.status(400).json({ 'status': 'failure - a query did not find all needed values with that title/author/name/address combination' });
		log("title " + title + ", author " + author + ", name " + name + ", address " + shippingAddress + " did not find a record in database");
	}
}

export const getShipmentStatus = async (req: Request, res: Response) => {
    const { title, author, name, shippingAddress } = req.body;

	//injection sanitizing
	let sanTitle = sanitizeString(title);
	let sanAuthor = sanitizeString(author);
	let sanName = sanitizeString(name);
	let sanAddr = sanitizeString(shippingAddress);

	try{
		const bid = await db.getBookId(sanTitle, sanAuthor);
		const cid = await db.getCustomerId(sanName, sanAddr);
		const pid = await db.getPOIdByContents(bid, cid);
		const shipped = await db.isPoShipped(pid);
		res.status(200).json({ shipped });
	}catch (error){
		res.status(400).json({ 'status': 'failure - a query did not find all needed values for that title/author/name/address combination' });
		log("title " + title + ", author " + author + ", name " + name + ", address " + shippingAddress + " did not find a record in database");
	}
}

export const shipOrder = async (req: Request, res: Response) => {
    const { pid } = req.body;

	//Int checking
	if (!validateInt(pid)){
		res.status(400).json({ 'status': 'failure - pid must be numeric' });
		log("pid " + pid + " was not numeric");
		return;
	}

	try{
		await db.shipPo(pid);
		res.status(200).json({ 'status': 'success' });
	}catch (error){
		res.status(400).json({ 'status': 'failure - a query did not find anything for that pid' });
		log("pid " + pid + " did not find anything in database");
	}
}

export const getOrderStatus = async (req: Request, res: Response) => {
    const { cid, bid } = req.body;

	//Int checking
	if (!validateInt(cid) || !validateInt(bid)){
		res.status(400).json({ 'status': 'failure - cid and bid must be numeric' });
		log("cid " + cid + " was not numeric");
		return;
	}

	try{
		const pid = await db.getPOIdByContents(bid, cid);
		const shipped = await db.isPoShipped(pid);
		const addr = await db.getCustomerAddress(cid)
		res.set('Content-Type', 'text/html');
		res.status(200)
		res.send(Buffer.from(`
		<html>
		<head>
		<title>Order Status</title>
		</head>
		<body>
			<h1>Order Status</h1>
			<p>Order ID: ${pid}</p>
			<p>Book ID: ${bid}</p>
			<p>Customer ID: ${cid}</p>
			<p>Is Shipped: ${shipped}</p>
			<p>Shipping Address: ${addr}</p>
		</body>
		</html>
		`));
	}catch (error){
		res.status(400).json({ 'status': 'failure - a query did not find all needed values for that bid and cid' });
		log("cid " + cid + ", bid " + bid + " did not find anything in the database");
	}
}
