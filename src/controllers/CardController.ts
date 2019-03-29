import {Card} from "../models/Card";
import ApiError from "../ApiError";
import {Request, Response} from "express";
import DatabaseService from "../DatabaseService";

const cardRepository = DatabaseService.getConnection().getRepository(Card);

const index = async (req: Request, res: Response) => {
  const {user_id} = req.query;
  const cards = await cardRepository.find({ where: { user_id } });
  return res.json(cards);
};

const show = async (req: Request, res: Response) => {
  const {id} = req.params;
  const card = await cardRepository.findOne(id);
  if (!card) {
    throw new ApiError("error/not-found", "Card not found");
  }
  return res.json(card);
};

const store = async (req: Request, res: Response) => {
  const {user_id, card_number} = req.body;
  const card = cardRepository.create({
    user_id, card_number
  });
  await cardRepository.save(card);
  return res.status(201).json(card);
};

const destroy = async (req: Request, res: Response) => {
  const {id} = req.params;
  const card = await cardRepository.findOne(id);
  if (!card) {
    throw new ApiError("error/not-found", "Card not found");
  }
  await cardRepository.delete(card);
  return res.json(card);
};

export {
  index, show, store, destroy
}
