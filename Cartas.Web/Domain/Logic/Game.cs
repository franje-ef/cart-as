using System;
using System.Collections.Generic;
using System.Linq;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Domain.Logic
{
    public class Game
    {
        public Game(string gameId, GameType gameType, Player masterPlayer)
        {
            GameId = gameId;
            GameType = gameType;
            MasterPlayer = masterPlayer;
            ActivePlayers = new List<Player>();
            WaitingPlayers = new List<Player>();

            AddPlayer(masterPlayer);
        }

        public string GameId { get; }
        public GameType GameType { get; }
        public bool Started { get; set; }
        public Player MasterPlayer { get; }
        public List<Player> ActivePlayers { get; private set; }
        public List<Player> WaitingPlayers { get; }
        
        public Card LastPlayedCard => _playedCards.Last();
        public int SeatTurn => ActivePlayers[_playerTurnIndex].Seat;
        public string Goal => Constants.Goals[_goalIndex];


        private int _totalDecks;
        private Queue<Card> _deckCards;
        private int _playerTurnIndex;
        private int _goalIndex;
        private List<Card> _playedCards = new List<Card>();


        private int PlayerCount => ActivePlayers.Count + WaitingPlayers.Count;

        public bool AddPlayer(Player player)
        {
            if (ActivePlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (WaitingPlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (PlayerCount > Constants.MaxPlayers) return false;

            player.Seat = Constants.Seats[PlayerCount];

            if (Started)
            {
                WaitingPlayers.Add(player);
            }
            else
            {
                ActivePlayers.Add(player);
            }

            return true;
        }

        public Player GetPlayer(string playerId)
        {
            return ActivePlayers.SingleOrDefault(x => x.PlayerId == playerId)
                   ?? WaitingPlayers.SingleOrDefault(x => x.PlayerId == playerId);
        }

        public void Start()
        {
            SetUpDecks();
            SetUpPlayers();
            _playedCards = new List<Card> { _deckCards.Dequeue() };
            Started = true;
        }

        public string ChangeGoal()
        {
            _goalIndex++;

            if (_goalIndex >= Constants.Goals.Length)
                _goalIndex = 0;

            return Goal;
        }

        public bool PlayCard(Player player, Card card)
        {
            if (ActivePlayers[_playerTurnIndex].PlayerId != player.PlayerId)
                return false;

            if (player.Cards.Remove(card) == false)
                return false;

            _playedCards.Add(card);
            _playerTurnIndex++;

            if (_playerTurnIndex >= ActivePlayers.Count)
                _playerTurnIndex = 0;

            return true;
        }

        private void SetUpDecks()
        {
            _totalDecks = Tools.GetDecksFromPlayerCount(PlayerCount);

            _deckCards = new Queue<Card>();
            var deckCards = new List<Card>();

            for (int deck = 0; deck < _totalDecks; deck++)
            {
                for (int suit = 1; suit <= 4; suit++)
                {
                    for (int num = 1; num <= 13; num++)
                    {
                        deckCards.Add(new Card(num, suit));
                    }
                }

                //Add Jokers
                deckCards.Add(new Card(1, 0));
                deckCards.Add(new Card(2, 0));
            }

            foreach (var card in deckCards.OrderBy(x => Guid.NewGuid()).ThenBy(x => Guid.NewGuid()))
            {
                _deckCards.Enqueue(card);
            }
        }

        private void SetUpPlayers()
        {
            _playerTurnIndex = 0;
            ActivePlayers.AddRange(WaitingPlayers);
            ActivePlayers = ActivePlayers.OrderBy(x => Guid.NewGuid()).ToList();
            WaitingPlayers.Clear();
            
            var seats = Constants.Seats.Take(ActivePlayers.Count).OrderBy(x => x).ToList();

            for (var i = 0; i < ActivePlayers.Count; i++)
            {
                var player = ActivePlayers[i];
                player.Seat = seats[i];
                player.Cards = new List<Card>();

                for (int j = 0; j < Constants.InitialCardCount; j++)
                {
                    player.Cards.Add(_deckCards.Dequeue());
                }
            }
        }

        
    }
}