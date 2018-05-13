import json

import tinycards
from tinycards.model.side import Side
from tinycards.model.concept import Concept
from tinycards.model.fact import Fact
from tinycards.model.deck import Deck
from tinycards.model.card import Card

from pprint import pprint as pp

user = ''
password = ''


def make_new_card(user_id, en, de):
    return (
        Side(user_id=user_id, concepts=[Concept(fact=Fact(en),
            user_id=user_id)]),
        Side(user_id=user_id, concepts=[Concept(fact=Fact(de),
            user_id=user_id)]),
    )


def update_a_deck(client, cards):
    all_decks = client.get_decks()
    d = all_decks[0]
    deck = client.get_deck(d.id)

    for c in cards:
        new_card = make_new_card(client.user_id, c['en'], c['de'])
        deck.add_card(new_card)

    client.update_deck(deck)


def main():
    client  = tinycards.Tinycards(user, password)
    print(client.user_id)
    s = client.data_source.session
    with open('dump/words.json') as f:
        words = json.load(f)
    update_a_deck(client, words)


if __name__ == '__main__':
    main()
