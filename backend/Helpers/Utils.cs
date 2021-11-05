using Microsoft.AspNetCore.Http;
using System;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

public static class Utils
    {
        private static Random random = new Random();
      
        /**
         * Generates RFC 4122 compliant Version 4 UUIDs.
         * @return  string
         */
        public static string GuidStr()
        {
            return Guid.NewGuid().ToString();;
        }

        /**
         * will return current DateTime in Mysql Default Date Time Format
         * @return  string
         */
        public static string DatetimeNow(string format = "yyyy-MM-dd HH:mm:ss")
        {
            return DateTime.Now.ToString(format);
        }

        /**
         * will return current Time in Mysql Default Date Time Format
         * @return  string
         */
        public static string TimeNow(string format = "HH:mm:ss")
        {
            return  DateTime.Now.ToString(format);
        }

        /**
         * will return current Date in Mysql Default Date Time Format
         * @return  string
         */
        public static string DateNow(string format = "yyyy-MM-dd")
        {
            return DateTime.Now.ToString(format);
        }
        /**
         * Parse Date Or Timestamp Object into Relative Time (e.g. 2 days Ago, 2 days from now)
         * @return  string
         */
        public static string RelativeDate(string dateStr)
        {
            if (DateTime.TryParse(dateStr.ToString(), out DateTime parsedDate))
            {
                const int SECOND = 1;
                const int MINUTE = 60 * SECOND;
                const int HOUR = 60 * MINUTE;
                const int DAY = 24 * HOUR;
                const int MONTH = 30 * DAY;

                var ts = new TimeSpan(DateTime.UtcNow.Ticks - parsedDate.Ticks);
                double delta = Math.Abs(ts.TotalSeconds);

                if (delta < 1 * MINUTE)
                    return ts.Seconds == 1 ? "one second ago" : ts.Seconds + " seconds ago";

                if (delta < 2 * MINUTE)
                    return "a minute ago";

                if (delta < 45 * MINUTE)
                    return ts.Minutes + " minutes ago";

                if (delta < 90 * MINUTE)
                    return "an hour ago";

                if (delta < 24 * HOUR)
                    return ts.Hours + " hours ago";

                if (delta < 48 * HOUR)
                    return "yesterday";

                if (delta < 30 * DAY)
                    return ts.Days + " days ago";

                if (delta < 12 * MONTH)
                {
                    int months = Convert.ToInt32(Math.Floor((double)ts.Days / 30));
                    return months <= 1 ? "one month ago" : months + " months ago";
                }
                else
                {
                    int years = Convert.ToInt32(Math.Floor((double)ts.Days / 365));
                    return years <= 1 ? "one year ago" : years + " years ago";
                }
            }
            return "Bad Date";
        }

        /**
         * Parse Date Or Timestamp Object into Human Readable Date (e.g. 26th of March 2016)
         * @return  string
         */
        public static string HumanDate(string dateStr)
        {
            if (DateTime.TryParse(dateStr.ToString(), out DateTime parsedDate))
            {
                return parsedDate.ToString("jS F, yyyy");
            }
            return "Bad Date";
        }

        /**
         * Parse Date Or Timestamp Object into Human Readable Date (e.g. 26th of March 2016)
         * @return  string
         */
        public static string HumanTime(string dateStr)
        {
            if (DateTime.TryParse(dateStr.ToString(), out DateTime parsedDate))
            {
                return parsedDate.ToString("h:i:s");
            }
            return "Bad Date";
        }

        /**
         * Parse Date Or Timestamp Object into Human Readable Date (e.g. 26th of March 2016 02:30)
         * @return  string
         */
        public static string HumanDatetime(string dateStr)
        {
            if (DateTime.TryParse(dateStr.ToString(), out DateTime parsedDate))
            {
                return parsedDate.ToString("jS F, Y h:i:s");
            }
            return "Bad Date";
        }

        /**
         * Approximate to nearest decimal points
         * @return  string
         */
        public static double Approximate(double val, int decimalpoints = 2)
        {
            return Math.Round(val, decimalpoints);
        }

        /**
         * Return String formatted in currency mode
         * @return  string
         */
        public static string ToCurrency(double value, string locale = "en-US")
        {
            return value.ToString("C3", CultureInfo.CreateSpecificCulture(locale));
        }

        /**
         * Trucate string
         * @return  string
         */
        public static string StrTruncate(string source, int length = 50, string ellipse = "...")
        {
            if (source.Length > length)
            {
                source = source.Substring(0, length) + ellipse;
            }
            return source;
        }

        /**
         * Generate a Random String and characters From Set Of supplied data context
         * @return  string
         */
        public static string RandomChars(int limit = 12, string context = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#%^&*_+-=")
        {
            return new string(Enumerable.Repeat(context, limit)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        /**
         * Generate a Random String From Set Of supplied data context
         * @return  string
         */
        public static string RandomStr(int limit = 12, string context = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890")
        {

            return new string(Enumerable.Repeat(context, limit)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        /**
         * Generate a Random color String 
         * @return  string
         */
        public static string RandomColor(int alpha = 1)
        {
            int red = random.Next(0, 255);
            int green = random.Next(0, 255);
            int blue = random.Next(0, 255);
            return $"rgba({red},{blue},{green},{alpha})";
        }
    }
