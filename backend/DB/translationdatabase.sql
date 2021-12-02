USE [MYNOTES]
GO

/****** Object:  Table [dbo].[NOTES]    Script Date: 11/4/2021 10:48:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTES](
	[NotesID] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](225) NULL,
	[Notes] [varchar](max) NULL,
	[LanguageCode] [varchar](10) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[NOTES] ON 
GO
INSERT [dbo].[NOTES] ([NotesID], [Title], [Notes], [LanguageCode]) VALUES (1, N'Deep motivational', N'Nothing in the world can take the place of Persistence. Talent will not; nothing is more common than unsuccessful men with talent. Genius will not; unrewarded genius is almost a proverb. Education will not; the world is full of educated derelicts. The slogan ''Press On'' has solved and always will solve the problems of the human race.', N'EN')
GO
INSERT [dbo].[NOTES] ([NotesID], [Title], [Notes], [LanguageCode]) VALUES (2, N'Concentrez toutes vos pens�es sur le travail en cours. ', N'Votre travail va remplir une grande partie de votre vie, et la seule fa�on d''�tre vraiment satisfait est de faire ce que vous croyez �tre un excellent travail. Et la seule fa�on de faire du bon travail est d''aimer ce que vous faites. Si vous ne l''avez pas encore trouv�, continuez � chercher. Ne vous contentez pas. Comme pour toutes les questions de c�ur, vous saurez quand vous le trouverez ', N'FR')
GO
INSERT [dbo].[NOTES] ([NotesID], [Title], [Notes], [LanguageCode]) VALUES (3, N'Education is the most powerful weapon which you can use to change the world.', N'Take the attitude of a student, never be too big to ask questions, never know too much to learn something new.', N'EN')
GO
SET IDENTITY_INSERT [dbo].[NOTES] OFF
GO
