﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WarOfMinds.Repositories.Entities
{
    public class Game
    {
        public Game()
        {
            this.Players = new HashSet<GamePlayer>();
        }

        [Key]
        private int gameID;

        public int GameID
        {
            get { return gameID; }
            set { gameID = value; }
        }

        private string subject;

        public string Subject
        {
            get { return subject; }
            set {
                subject = null!;
                subject = value;
            }
        }

        private DateTime gameDate;

        public DateTime GameDate
        {
            get { return gameDate; }
            set { gameDate = value; }
        }


        private int gameLength;

        public int GameLength
        {
            get { return gameLength; }
            set { gameLength = value; }
        }
        
        private bool isActive;

        public bool IsActive
        {
            get { return isActive; }
            set { isActive = value; }
        }

        private bool onHold;

        public bool OnHold
        {
            get { return onHold; }
            set { onHold = value; }
        }

        private int rating;

        public int Rating
        {
            get { return rating; }
            set { rating = value; }
        }

        public virtual ICollection<GamePlayer> Players { get; set; }
    }
}
